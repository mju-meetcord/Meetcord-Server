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

const CreateEvent = async (data) => {
  console.log(data);
  console.log("DB create Event");
  const sql = 'INSERT INTO `group_events` (`group_e_id`, `title`, `description`,`start_time`,`end_time`,`place`,`joinlist`) VALUES ((SELECT group_id FROM `groups`WHERE name = ?),?,?,?,?,?,?)';
  
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


const RegisterMeet = async (data) => {
  console.log("DB register Meet");
  const sql = 'INSERT INTO `group_members` (`user_m_id`, `group_m_id`, `role`) VALUES (?,?,?)';
  
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, data);

    const [rows2, fields2] = await connection.execute('SELECT COUNT(group_m_id) as count FROM group_members WHERE group_m_id = ?',[data[1]]);
    console.log(rows2[0].count);

    connection.execute('UPDATE `groups` SET `count` = ? WHERE `group_id` = ?',[rows2[0].count,data[1]]);

    console.log(rows);
    console.log(fields);

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const CreateNoti = async (data) => {
  console.log("DB create Noti");
  const sql = 'INSERT INTO `group_notifications` (`group_id`, `title`, `message`,`user_id`) VALUES (?,?,?,?)';
  
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


const CreateRecord = async (data) => {
  console.log("DB create record");
  const sql = 'INSERT INTO `group_record` (`event_r_id`, `main_img`, `tag_message`,`detail`) VALUES (?,?,?,?)';
  
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
        user_id,
        name,
        birthday,
        profile_photo,
        phone,
        nickname,
      } = rows[0];


      console.log("readAccount _ query_result_email : " + email);
      console.log("readAccount _ query_result_pw : " + password);

      const result = option?[user_id]:[email,password,name,birthday,profile_photo,phone,nickname,user_id];
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


const updateEvent = async (data) => {
  console.log("DB update Account ");

  const sql = 'UPDATE group_events SET  title=? , description=?, start_time=?, end_time=?, place=? WHERE event_id=?';
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql, data);

    return 1;

  } catch (err) {
    console.error(err);
    return 0;
  }
};

const readMeetList = async (data) => {
  console.log("DB Read MeetList");


  const sql = 'SELECT name,description,group_id,profile,count FROM `groups` WHERE name LIKE ?';

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

const readMyMeetList = async (data) => {
  console.log("DB Read MyMeetList");

  const sql = 'SELECT role,group_id,name,profile,description,g.count,g.creator_id FROM group_members AS gm JOIN `groups` AS g ON gm.group_m_id = g.group_id WHERE gm.user_m_id = ?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[parseInt(data)]);
    console.log(rows);
    if (rows.length) {
      console.log(rows);

      return rows;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

const readNotiList = async (data) => {
  console.log("DB Read NotiList");

  const sql = 'SELECT title,created_at,notification_id FROM group_notifications WHERE group_id IN (SELECT group_id FROM `groups`WHERE name = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
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

const readEventList = async (data) => {
  console.log("DB Read NotiList");

  const sql = 'SELECT * FROM group_events WHERE group_e_id IN (SELECT group_id FROM `groups`WHERE name = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
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

const readRecord = async (data) => {
  console.log("DB Read record");

  const sql = 'SELECT * FROM group_record WHERE event_r_id = ?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
    console.log(rows);

    return rows;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const readMemberList = async (data) => {
  console.log("DB Read readMemberList");

  const sql = 'SELECT users.user_id,users.email,users.name,users.birthday,users.profile_photo,users.introduction,users.phone,users.nickname, group_members.role, group_members.member_id FROM users JOIN group_members ON users.user_id = group_members.user_m_id WHERE group_members.group_m_id = (SELECT group_id FROM `groups`WHERE name = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
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

const readNotiListDetail = async (data) => {
  console.log("DB Read NotiListDetail");

  const sql = 'SELECT * FROM group_notifications WHERE notification_id= ?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
    if (rows.length) {
      console.log(rows);

      return rows[0];
    } else {
      return 0;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const DeleteNoti = async (data) => {
  console.log("DB Delete Noti");

  const sql = 'Delete FROM group_notifications WHERE notification_id= ?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
    if (rows.length) {
      console.log(rows);

      return 1;
    } else {
      return 0;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const DeleteEvent = async (data) => {
  console.log("DB Delete Event");

  const sql = 'Delete FROM group_record WHERE  event_r_id= ?';
  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
    const sql2 = 'Delete FROM group_events WHERE  event_id= ?';
    const [rows2, fields2] = await connection.execute(sql2,[data]);

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const DeleteMember = async (data) => {
  console.log("DB Delete member");

  let sql = 'SELECT group_m_id FROM group_members WHERE member_id=?';

  console.log("DB request query : " + sql);

  try {
    const [rows] = await connection.execute(sql,[data]);
    const [rows2] = await connection.execute('Delete FROM group_members WHERE member_id= ?',[data]);

    const [rows3]= await connection.execute('SELECT COUNT(group_m_id) as count FROM group_members WHERE group_m_id = ?',[rows[0].group_m_id]);
    connection.execute('UPDATE `groups` SET `count` = ? WHERE `group_id` = ?',[rows3[0].count,rows[0].group_m_id]);

    console.log(rows); 

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};
const DeleteMember2 = async (data) => {
  console.log("DB Delete member");

  let sql = 'SELECT * FROM group_members WHERE group_m_id IN (?)AND user_m_id IN (?)';

  console.log("DB request query : " + sql);

  try {
    const [rows] = await connection.execute(sql,data);
    const [rows2] = await connection.execute('Delete FROM group_members WHERE member_id= ?',[rows[0].member_id]);

    const [rows3]= await connection.execute('SELECT COUNT(group_m_id) as count FROM group_members WHERE group_m_id = ?',[data[0]]);
    connection.execute('UPDATE `groups` SET `count` = ? WHERE `group_id` = ?',[rows3[0].count,data[0]]);

    console.log(rows); 

    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const UpdateNoti = async (data) => {
  console.log("DB Update Noti");

  const sql = 'UPDATE group_notifications SET title = ?, message = ? WHERE (notification_id = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,data);
    
    if(rows.changedRows){
      return 1;
    }else{
      return 0;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const UpdateUser = async (data) => {
  console.log("DB Delete Noti");

  const sql = 'UPDATE users SET nickname = ?, profile_photo = ? WHERE (user_id = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,data);
    
    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const updateMember=async (data) => {
  console.log("DB update member");

  const sql = 'UPDATE group_members SET role = ? WHERE (member_id = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,data);
    
    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const UpdateRecord = async (data) => {
  console.log("DB Delete Noti");

  const sql = 'UPDATE group_record SET detail = ?,tag_message = ?, main_img = ? WHERE ( record_id = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,data);
    
    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const readEvent = async (data) => {
  console.log("DB Read NotiList");

  const sql = 'SELECT * FROM group_events WHERE  event_id=?';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,[data]);
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

const UpdateAttendencd = async (data) => {
  console.log("DB Delete Noti");

  const sql = 'UPDATE group_events SET joinlist = ? WHERE ( event_id = ?)';

  console.log("DB request query : " + sql);

  try {
    const [rows, fields] = await connection.execute(sql,data);
    
    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};


module.exports = {
  CreateAccount,
  readAccount,
  updateAccount,
  readMeetList,
  CreateMeet,
  readNotiList,
  readNotiListDetail,
  CreateNoti,
  DeleteNoti,
  UpdateNoti,
  readMyMeetList,
  UpdateUser,
  RegisterMeet,
  readMemberList,
  updateMember,
  DeleteMember,
  DeleteMember2,
  readEventList,
  CreateEvent,
  updateEvent,
  DeleteEvent,
  readRecord,
  UpdateRecord,
  CreateRecord,
  readEvent,
  UpdateAttendencd
};