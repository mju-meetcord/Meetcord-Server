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

// 이메일을 받아 , DB에서 조회 후 해당하는 결과 반환
const readAccount = async (email) => {
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
        password
      } = rows[0];

      console.log("readAccount _ query_result_email : " + email);
      console.log("readAccount _ query_result_pw : " + password);

      return [email, password];
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

module.exports = {
  CreateAccount,
  readAccount,
  updateAccount,
  deleteAccount
};