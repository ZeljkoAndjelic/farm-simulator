export default () => ({
  mysqlHost: process.env.MYSQL_HOST,
  mysqlRootPassword: process.env.MYSQL_ROOT_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  port: process.env.PORT,
});
