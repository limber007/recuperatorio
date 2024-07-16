import { sequelize} from '../database/database.js';
import { DataTypes } from 'sequelize';
import { Status } from '../constants/index.js';
import { Task } from './tasks.js';
import { ecriptar } from '../common/bycript.js';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg:'Ingrese nombre de usuario',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg:'Ingrese contraseña',
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `Debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`,
            },
        },
    },
});

//Forma Automática
//un usuario tiene muchas tareas
User.hasMany(Task);
//pero una tarea solo pertenece a un usuario
Task.belongsTo(User);

/*/forma manual
User.hasMany(Task, {
    foreignKey: 'user_id',
    sourceKey:'id'
})

Task.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id'
})*/  

User.beforeCreate(async (user) => {
    try {
        user.password = await ecriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar la contraseña');
    }
});

User.beforeUpdate(async (user) => {
    try {
        user.password = await ecriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar la contraseña');
    }
});