const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'meetcord_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const CreateAccount = async (data) => {
  console.log("DB create Account");
  const sql = `INSERT INTO users (email,phone,name, password, birthday)
                    VALUES (?,?,?,?,?)`;
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, data);

    console.log(rows);
    console.log(fields);

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const CreateMeet = async (data) => {
  console.log("DB create Meet");
  const sql = 'INSERT INTO `groups` (`name`, `description`, `creator_id`,`profile`) VALUES (?,?,?,?)';
  
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, data);

    console.log(rows);
    console.log(fields);

    // 멤버 추가
    const sql2 = 'INSERT INTO `group_members` (`user_m_id`, `group_m_id`, `role`) VALUES (?,?,?)';
    const [rows2, fields2] = await connection.execute(sql2, [data[2],rows.insertId,"admin"]);
    console.log(rows2);
    console.log(fields2);

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

// 이메일을 받아 , DB에서 조회 후 해당하는 결과 반환
const readAccount = async (email,option) => {
  console.log("DB Read Account :" + email);

  // 이메일로 DB에서 검색 -> email은 중복이 안되도록 할 예정이기에 1개아니면 0개 반환 예상
  const sql = 'SELECT * FROM users WHERE email = ?';
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, [email]);
    if (rows.length) {
      console.log(rows[0]);

      const {
        email,
        password,
        user_id
      } = rows[0];


      console.log("readAccount _ query_result_email : " + email);
      console.log("readAccount _ query_result_pw : " + password);

      const result = option?[user_id]:[email,password];
      return result;
    } else {
      return 0;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const updateAccount = async (email) => {
  console.log("DB update Account :" + email);

  // 이메일로 DB에서 검색 -> email은 중복이 안되도록 할 예정이기에 1개아니면 0개 반환 예상
  const sql = 'UPDATE users SET nickname=? WHERE email=?';
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, ["testNick", email]);
    if (rows.length) {
      console.log(rows);
      return 1;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const deleteAccount = () => {

};

const readMeetList = async (data) => {
  console.log("DB Read MeetList");


  const sql = 'SELECT name,description FROM `groups` WHERE name LIKE ?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[ '%'+data+'%']);
    if (rows.length) {
      console.log(rows);

      return rows;
    } else {
      return 0;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

module.exports = {
  CreateAccount,
  readAccount,
  updateAccount,
  deleteAccount,
  readMeetList,
  CreateMeet
};