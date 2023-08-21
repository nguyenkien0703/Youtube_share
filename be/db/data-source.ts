

// export const  dataSourceOptions: DataSourceOptions= {
//     host: process.env.DB_HOST ,
//     type: "mysql" ,// i don't know why i set value equivalent process.env.DB_TYPE error?
//     port:parseInt(process.env.DB_PORT, 10) ,
//     username: process.env.DB_USER ,
//     password: process.env.DB_PASS ,
//     database:  process.env.DB_NAME ,
//     entities: [
        // User,
        // Share,
        // UserLike,
        // Video
//     ],
//     synchronize: true 
// }

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Share } from "src/share/share.entity";
import { User } from "src/user/entitties/user.entity";
import { UserLike } from "src/user_like/entity/like.entity";
import { Video } from "src/video/entity/video.entity";


// const dataSource = new DataSource(dataSourceOptions);
// export default dataSource;


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get('database.host'),
          port: +configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.pass'),
          database: configService.get('database.name'),
          entities: [
              User,
              Share,
              UserLike,
              Video
          ],
          synchronize: true,
          debug: false,
          logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
