import { sql } from '@/lib/db';

export async function createTables() {
  try {
    // 기존 테이블 (레거시 지원)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 폴 테이블 - created_by_name 추가
    await sql`
      CREATE TABLE IF NOT EXISTS polls (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_by INTEGER REFERENCES users(id),
        created_by_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ends_at TIMESTAMP
      )
    `;

    // 폴 옵션 테이블 - 이미지 URL 추가
    await sql`
      CREATE TABLE IF NOT EXISTS poll_options (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
        option_text VARCHAR(200) NOT NULL,
        image_url TEXT,
        map_url TEXT,
        added_by_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 투표 테이블 - display_name으로 변경
    await sql`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
        option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(poll_id, display_name)
      )
    `;

    // 댓글 테이블 추가
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
        display_name VARCHAR(100) NOT NULL,
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 컬럼 추가 (기존 테이블에 누락된 컬럼 추가)
    await sql`
      ALTER TABLE polls ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(100)
    `;

    await sql`
      ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS image_url TEXT
    `;

    await sql`
      ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS added_by_name VARCHAR(100)
    `;

    await sql`
      ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS map_url TEXT
    `;

    await sql`
      ALTER TABLE votes ADD COLUMN IF NOT EXISTS display_name VARCHAR(100)
    `;

    // display_name에 대한 unique index 생성 (constraint 대신 index 사용)
    // 기존 user_id 기반 constraint 삭제
    try {
      await sql`ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_poll_id_user_id_key`;
    } catch {
      // 무시 - constraint가 없을 수 있음
    }

    // display_name 기반 unique index 추가
    try {
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_poll_display_name ON votes (poll_id, display_name)`;
      // Additional index for faster lookups
      await sql`CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes (poll_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_votes_display_name ON votes (display_name)`;
    } catch {
      // 무시 - index가 이미 있을 수 있음
    }

    // 기본 사용자 삽입
    await sql`
      INSERT INTO users (id, username, email)
      VALUES (1, 'default_user', 'default@example.com')
      ON CONFLICT (id) DO NOTHING
    `;

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    return await sql`SELECT * FROM users ORDER BY created_at DESC`;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

// 옵션 타입 정의
interface PollOptionInput {
  text: string;
  imageUrl?: string;
}

export async function createPoll(
  title: string,
  description: string,
  options: (string | PollOptionInput)[],
  createdByName: string
) {
  try {
    const [poll] = await sql`
      INSERT INTO polls (title, description, created_by, created_by_name)
      VALUES (${title}, ${description}, 1, ${createdByName})
      RETURNING *
    `;

    console.log('Poll created:', poll);

    for (const option of options) {
      const optionText = typeof option === 'string' ? option : option.text;
      const imageUrl = typeof option === 'string' ? null : option.imageUrl || null;

      const [createdOption] = await sql`
        INSERT INTO poll_options (poll_id, option_text, image_url, added_by_name)
        VALUES (${poll.id}, ${optionText}, ${imageUrl}, ${createdByName})
        RETURNING *
      `;
      console.log('Option created:', createdOption);
    }

    return poll;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

export async function getPolls() {
  try {
    const polls = await sql`
      SELECT p.*,
             COALESCE(p.created_by_name, u.username) as created_by_username,
             COUNT(v.id) as total_votes
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN votes v ON p.id = v.poll_id
      GROUP BY p.id, u.username
      ORDER BY p.created_at DESC
    `;
    console.log('Polls fetched:', polls);
    return polls;
  } catch (error) {
    console.error('Error getting polls:', error);
    throw error;
  }
}

export async function getPollById(id: number) {
  const startTime = Date.now();
  try {
    console.log(`Fetching poll ${id}`);
    
    // Get basic poll info first
    const [poll] = await sql`
      SELECT p.*,
             COALESCE(p.created_by_name, u.username) as created_by_username
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ${id}
    `;

    if (!poll) {
      console.log('Poll not found with id:', id);
      return null;
    }

    // Get options separately - this is usually faster
    const options = await sql`
      SELECT po.*, COUNT(v.id) as vote_count
      FROM poll_options po
      LEFT JOIN votes v ON po.id = v.option_id
      WHERE po.poll_id = ${id}
      GROUP BY po.id
      ORDER BY po.created_at
    `;

    const totalTime = Date.now() - startTime;
    console.log(`getPollById completed in ${totalTime}ms for poll ${poll.id} with ${options.length} options`);
    return { ...poll, options };
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Error getting poll by id after ${totalTime}ms:`, error);
    throw error;
  }
}

// display_name 기반 투표
export async function vote(pollId: number, optionId: number, displayName: string) {
  console.log('Vote attempt:', { pollId, optionId, displayName });

  try {
    // 먼저 기존 투표 확인
    console.log('Checking existing vote...');
    const existingVote = await sql`
      SELECT id FROM votes
      WHERE poll_id = ${pollId} AND display_name = ${displayName}
    `;
    console.log('Existing vote result:', existingVote);

    if (existingVote.length > 0) {
      // 기존 투표 업데이트
      console.log('Updating existing vote...');
      await sql`
        UPDATE votes
        SET option_id = ${optionId}
        WHERE poll_id = ${pollId} AND display_name = ${displayName}
      `;
    } else {
      // 새 투표 삽입
      console.log('Inserting new vote...');
      await sql`
        INSERT INTO votes (poll_id, option_id, user_id, display_name)
        VALUES (${pollId}, ${optionId}, 1, ${displayName})
      `;
    }

    const [option] = await sql`
      SELECT COUNT(*) as vote_count
      FROM votes
      WHERE option_id = ${optionId}
    `;

    console.log('Vote recorded for poll:', pollId, 'option:', optionId, 'by:', displayName);
    return option.vote_count;
  } catch (error) {
    console.error('Error voting - full error:', error);
    throw error;
  }
}

// 사용자가 해당 폴에 투표했는지 확인
export async function hasUserVoted(pollId: number, displayName: string) {
  const startTime = Date.now();
  try {
    console.log(`Checking vote for poll ${pollId}, user ${displayName}`);
    const result = await sql`
      SELECT option_id FROM votes
      WHERE poll_id = ${pollId} AND display_name = ${displayName}
    `;
    const duration = Date.now() - startTime;
    console.log(`Vote check completed in ${duration}ms, found: ${result.length > 0}`);
    return result.length > 0 ? result[0].option_id : null;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Error checking vote status after ${duration}ms:`, error);
    throw error;
  }
}

// 폴 옵션 추가
export async function addPollOption(pollId: number, optionText: string, imageUrl: string | null, mapUrl: string | null, addedByName: string) {
  try {
    const [option] = await sql`
      INSERT INTO poll_options (poll_id, option_text, image_url, map_url, added_by_name)
      VALUES (${pollId}, ${optionText}, ${imageUrl}, ${mapUrl}, ${addedByName})
      RETURNING *
    `;
    console.log('Option added:', option);
    return option;
  } catch (error) {
    console.error('Error adding option:', error);
    throw error;
  }
}

// 댓글 가져오기
export async function getComments(pollId: number) {
  try {
    const comments = await sql`
      SELECT * FROM comments
      WHERE poll_id = ${pollId}
      ORDER BY created_at DESC
    `;
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

// 댓글 추가
export async function addComment(pollId: number, displayName: string, content: string | null, imageUrl: string | null) {
  try {
    const [comment] = await sql`
      INSERT INTO comments (poll_id, display_name, content, image_url)
      VALUES (${pollId}, ${displayName}, ${content}, ${imageUrl})
      RETURNING *
    `;
    console.log('Comment added:', comment);
    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: number, displayName: string) {
  try {
    const [deletedComment] = await sql`
      DELETE FROM comments
      WHERE id = ${commentId} AND display_name = ${displayName}
      RETURNING *
    `;
    console.log('Comment deleted:', deletedComment);
    return deletedComment;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function deleteVote(pollId: number, displayName: string) {
  try {
    const [deletedVote] = await sql`
      DELETE FROM votes
      WHERE poll_id = ${pollId} AND display_name = ${displayName}
      RETURNING *
    `;
    console.log('Vote deleted:', deletedVote);
    return deletedVote;
  } catch (error) {
    console.error('Error deleting vote:', error);
    throw error;
  }
}

// Get vote information including timestamp
export async function getUserVoteInfo(pollId: number, displayName: string) {
  try {
    const [vote] = await sql`
      SELECT v.*, po.option_text, po.image_url, po.map_url
      FROM votes v
      JOIN poll_options po ON v.option_id = po.id
      WHERE v.poll_id = ${pollId} AND v.display_name = ${displayName}
    `;
    return vote || null;
  } catch (error) {
    console.error('Error getting vote info:', error);
    throw error;
  }
}

// Get all votes for a poll with timestamps
export async function getPollVotes(pollId: number) {
  try {
    const votes = await sql`
      SELECT v.display_name, v.option_id, v.created_at, po.option_text, po.image_url, po.map_url
      FROM votes v
      JOIN poll_options po ON v.option_id = po.id
      WHERE v.poll_id = ${pollId}
      ORDER BY v.created_at DESC
    `;
    return votes;
  } catch (error) {
    console.error('Error getting poll votes:', error);
    throw error;
  }
}