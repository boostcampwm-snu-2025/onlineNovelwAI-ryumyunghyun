import sqlite3 from 'sqlite3';
import path from 'path';

const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Novels table
    db.run(`
      CREATE TABLE IF NOT EXISTS novels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Chapters table
    db.run(`
      CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        novel_id INTEGER NOT NULL,
        chapter_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        word_count INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (novel_id) REFERENCES novels(id),
        UNIQUE(novel_id, chapter_number)
      )
    `);

    // Personas table
    db.run(`
      CREATE TABLE IF NOT EXISTS personas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        evaluation_criteria TEXT NOT NULL,
        tone TEXT NOT NULL
      )
    `);

    // AI Reviews table
    db.run(`
      CREATE TABLE IF NOT EXISTS ai_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        persona_id INTEGER NOT NULL,
        review_text TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id),
        FOREIGN KEY (persona_id) REFERENCES personas(id)
      )
    `);

    // Insert personas
    const personas = [
      {
        name: '캐주얼 독자',
        type: 'casual-reader',
        description: '평범한 독자, 재미와 몰입도 중시',
        evaluation_criteria: '흥미도, 가독성, 공감도',
        tone: '친근하고 솔직함'
      },
      {
        name: '문학 평론가',
        type: 'literary-critic',
        description: '전문적인 문학 평론가',
        evaluation_criteria: '문체, 주제의식, 서사 구조, 상징성',
        tone: '격식있고 학술적'
      },
      {
        name: '장르 팬',
        type: 'genre-enthusiast',
        description: '특정 장르의 열성 팬',
        evaluation_criteria: '장르 컨벤션, 클리셰 활용, 참신성',
        tone: '열정적이고 비교 분석적'
      },
      {
        name: '편집자',
        type: 'editor',
        description: '출판 편집자',
        evaluation_criteria: '맞춤법, 문법, 문장 구조, 가독성',
        tone: '객관적이고 실용적'
      },
      {
        name: '상업 출판인',
        type: 'commercial-publisher',
        description: '상업적 관점의 출판인',
        evaluation_criteria: '시장 트렌드, 상업성, 타겟 독자',
        tone: '비즈니스 지향적, 전략적'
      },
      {
        name: '창작 작가 동료',
        type: 'fellow-writer',
        description: '동료 작가',
        evaluation_criteria: '창작 과정, 작가의 의도, 기술적 어려움',
        tone: '따뜻하고 지지적'
      }
    ];

    const insertPersona = db.prepare(`
      INSERT OR IGNORE INTO personas (name, type, description, evaluation_criteria, tone)
      VALUES (?, ?, ?, ?, ?)
    `);

    personas.forEach(persona => {
      insertPersona.run(
        persona.name,
        persona.type,
        persona.description,
        persona.evaluation_criteria,
        persona.tone
      );
    });

    insertPersona.finalize();

    console.log('Database initialized successfully');
  });
}

export default db;
