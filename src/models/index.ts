import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { PetFactory } from './pet.js';

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
      process.env.DB_NAME || '',
      process.env.DB_USER || '',
      process.env.DB_PASSWORD,
      {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
          decimalNumbers: true,
        },
      },
    );

const User = UserFactory(sequelize);
const Pet = PetFactory(sequelize);

User.belongsToMany(Pet, { through: 'UserPets' });
Pet.belongsToMany(User, { through: 'UserPets' });

export { sequelize, User, Pet };
