# TheDrinkCode-RestaurantAPI

## Developer Steps

1. Clone this repository
2. Run yarn to install all dependencies
3. Rename the .envtemplate file located on env folder to .env and request the corresponding data
4. Run the following commands to set up the DB on docker
  docker run -d -p 33060:3306 --name TDC-MYSQL -e MYSQL_ROOT_PASSWORD={REQUESTPASSWORD} mysql
5. To check the DB on console run the followin command
  docker exec -it TDC-MYSQL mysql -p
6. If you want it's posible to use a DB admin like Mysql Workbench

## Migrations TYPEORM

1. Rename the file ormconfig.template.ts localed on migrations folder to ormconfig.ts and request the corresponding data

2. Command to generate a new migration
yarn typeorm:generate-migration

3. Command to run a migration
yarn typeorm:run-migration
