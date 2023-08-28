import { DataSource } from 'typeorm';
import { TDC1692829264561 } from './generated/1692829264561-TDC';
const devDataSource = new DataSource({
  type: 'mysql',
  host: 'xxxx',
  port: 1000,
  username: 'xxxx',
  password: 'xxxx',
  database: 'xxxx',
  entities: ['**/*.entity.js'],
  synchronize: false,
  migrations: [TDC1692829264561],
});

export default devDataSource;
