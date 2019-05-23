// db.js
var Mock = require("mockjs");

module.exports = {
  //用户登录
  login: Mock.mock({
    resultCode: "SUCCESS",
    message: "查看系统通知。",
    data: {
      user: {
        userId: "@id",
        truename: "@cname",
        roleType:
          "@pick(['cityedu-admin','district-admin','school-admin', 'teacher', 'student'])",
        appOrgId: "@id",
        passwordUpdated: "@pick(['y','n'])",
        gender: "@pick(['F','M'])"
        // "portraitUrl":
      },
      calendar: {
        calendarId: "@id",
        caldedarStatu: "@integer(1, 2)"
      }
    }
  }),

  //判断当前是否登陆
  checklogin: Mock.mock({
    resultCode: "SUCCESS",
    message: "操作成功！",
    data: {
      isLogin: "@integer(0, 1)",
      user: {
        userId: "@id",
        passwordUpdated: "@pick(['y','n'])",
        truename: "@cname"
      }
    }
  }),
  //退出登录
  logout: Mock.mock({
    resultCode: "SUCCESS",
    message: "退出成功!"
  }),
  // 获取账号列表
  getAccountLs: Mock.mock({
    resultCode: "000000",
    message: "查看机构列表。",
    data: {
      "accountNumbers|12": [
        {
          subjectId: "@character(upper)@string(number,11)",
          firstName: "@cname",
          loginName: "@name",
          subjectType: "系统管理员",
          signature: "@csentence(3,50)",
          lastLoginDtStr: "@date(yyyy/MM/dd)",
          version: "V@string(number,3)"
        }
      ],
      totalRecordCount: 12
    }
  })
};
