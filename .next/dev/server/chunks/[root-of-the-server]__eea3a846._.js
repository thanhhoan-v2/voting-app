module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
}),
"[project]/src/lib/db-actions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addComment",
    ()=>addComment,
    "addPollOption",
    ()=>addPollOption,
    "createPoll",
    ()=>createPoll,
    "createTables",
    ()=>createTables,
    "deleteComment",
    ()=>deleteComment,
    "deleteVote",
    ()=>deleteVote,
    "getComments",
    ()=>getComments,
    "getPollById",
    ()=>getPollById,
    "getPolls",
    ()=>getPolls,
    "getUsers",
    ()=>getUsers,
    "hasUserVoted",
    ()=>hasUserVoted,
    "vote",
    ()=>vote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
async function createTables() {
    try {
        // 기존 테이블 (레거시 지원)
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        // 폴 테이블 - created_by_name 추가
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      CREATE TABLE IF NOT EXISTS poll_options (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
        option_text VARCHAR(200) NOT NULL,
        image_url TEXT,
        added_by_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        // 투표 테이블 - display_name으로 변경
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      ALTER TABLE polls ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(100)
    `;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS image_url TEXT
    `;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS added_by_name VARCHAR(100)
    `;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      ALTER TABLE votes ADD COLUMN IF NOT EXISTS display_name VARCHAR(100)
    `;
        // display_name에 대한 unique index 생성 (constraint 대신 index 사용)
        // 기존 user_id 기반 constraint 삭제
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_poll_id_user_id_key`;
        } catch  {
        // 무시 - constraint가 없을 수 있음
        }
        // display_name 기반 unique index 추가
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_poll_display_name ON votes (poll_id, display_name)`;
            // Additional index for faster lookups
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes (poll_id)`;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CREATE INDEX IF NOT EXISTS idx_votes_display_name ON votes (display_name)`;
        } catch  {
        // 무시 - index가 이미 있을 수 있음
        }
        // 기본 사용자 삽입
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function getUsers() {
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`SELECT * FROM users ORDER BY created_at DESC`;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}
async function createPoll(title, description, options, createdByName) {
    try {
        const [poll] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO polls (title, description, created_by, created_by_name)
      VALUES (${title}, ${description}, 1, ${createdByName})
      RETURNING *
    `;
        console.log('Poll created:', poll);
        for (const option of options){
            const optionText = typeof option === 'string' ? option : option.text;
            const imageUrl = typeof option === 'string' ? null : option.imageUrl || null;
            const [createdOption] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function getPolls() {
    try {
        const polls = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function getPollById(id) {
    const startTime = Date.now();
    try {
        console.log(`Fetching poll ${id}`);
        // Get basic poll info first
        const [poll] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
        const options = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT po.*, COUNT(v.id) as vote_count
      FROM poll_options po
      LEFT JOIN votes v ON po.id = v.option_id
      WHERE po.poll_id = ${id}
      GROUP BY po.id
      ORDER BY po.created_at
    `;
        const totalTime = Date.now() - startTime;
        console.log(`getPollById completed in ${totalTime}ms for poll ${poll.id} with ${options.length} options`);
        return {
            ...poll,
            options
        };
    } catch (error) {
        const totalTime = Date.now() - startTime;
        console.error(`Error getting poll by id after ${totalTime}ms:`, error);
        throw error;
    }
}
async function vote(pollId, optionId, displayName) {
    console.log('Vote attempt:', {
        pollId,
        optionId,
        displayName
    });
    try {
        // 먼저 기존 투표 확인
        console.log('Checking existing vote...');
        const existingVote = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT id FROM votes
      WHERE poll_id = ${pollId} AND display_name = ${displayName}
    `;
        console.log('Existing vote result:', existingVote);
        if (existingVote.length > 0) {
            // 기존 투표 업데이트
            console.log('Updating existing vote...');
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
        UPDATE votes
        SET option_id = ${optionId}
        WHERE poll_id = ${pollId} AND display_name = ${displayName}
      `;
        } else {
            // 새 투표 삽입
            console.log('Inserting new vote...');
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
        INSERT INTO votes (poll_id, option_id, user_id, display_name)
        VALUES (${pollId}, ${optionId}, 1, ${displayName})
      `;
        }
        const [option] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function hasUserVoted(pollId, displayName) {
    const startTime = Date.now();
    try {
        console.log(`Checking vote for poll ${pollId}, user ${displayName}`);
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function addPollOption(pollId, optionText, imageUrl, addedByName) {
    try {
        const [option] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO poll_options (poll_id, option_text, image_url, added_by_name)
      VALUES (${pollId}, ${optionText}, ${imageUrl}, ${addedByName})
      RETURNING *
    `;
        console.log('Option added:', option);
        return option;
    } catch (error) {
        console.error('Error adding option:', error);
        throw error;
    }
}
async function getComments(pollId) {
    try {
        const comments = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function addComment(pollId, displayName, content, imageUrl) {
    try {
        const [comment] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function deleteComment(commentId, displayName) {
    try {
        const [deletedComment] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
async function deleteVote(pollId, displayName) {
    try {
        const [deletedVote] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
}),
"[project]/src/app/api/polls/[id]/vote/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db-actions.ts [app-route] (ecmascript)");
;
;
async function POST(request, { params }) {
    try {
        const resolvedParams = await params;
        const { optionId, displayName } = await request.json();
        if (!optionId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Option ID is required'
            }, {
                status: 400
            });
        }
        if (!displayName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Display name is required'
            }, {
                status: 400
            });
        }
        const voteCount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["vote"])(parseInt(resolvedParams.id), optionId, displayName);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            voteCount
        });
    } catch (error) {
        console.error('Error voting:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to vote',
            details: errorMessage
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const { displayName } = await request.json();
        if (!displayName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Display name is required'
            }, {
                status: 400
            });
        }
        const deletedVote = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$actions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteVote"])(parseInt(resolvedParams.id), displayName);
        if (!deletedVote) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Vote not found or not authorized to delete'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            deletedVote
        });
    } catch (error) {
        console.error('Error deleting vote:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete vote'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eea3a846._.js.map