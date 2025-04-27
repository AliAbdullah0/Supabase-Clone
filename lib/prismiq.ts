// Create User model
import { addField, addRelation, createModel, generatePrismaSchema, savePrismaSchema, setPrimaryKey } from 'prismiq'
createModel('User');
addField('User', 'id', 'String', 'cuid()');
setPrimaryKey('User', 'id');
addField('User', 'email', 'String', undefined, true);
addField('User', 'name', 'String');
addField('User', 'createdAt', 'Date', 'now()');

// Create Post model
createModel('Post');
addField('Post', 'id', 'String', 'cuid()');
setPrimaryKey('Post', 'id');
addField('Post', 'title', 'String');
addField('Post', 'content', 'String');
addField('Post', 'createdAt', 'Date', 'now()');
addField('Post', 'authorId', 'String');

// Create the relation: One User has many Posts
addRelation('User', 'posts', 'OneToMany', 'Post', 'author');
addRelation('Post', 'author', 'ManyToOne', 'User', 'posts');

// Create Profile model
createModel('Profile');
addField('Profile', 'id', 'String', 'cuid()');
setPrimaryKey('Profile', 'id');
addField('Profile', 'bio', 'String');
addField('Profile', 'userId', 'String');

// Create the relation: One User has one Profile
addRelation('User', 'profile', 'OneToOne', 'Profile', 'user');
addRelation('Profile', 'user', 'OneToOne', 'User', 'profile');

generatePrismaSchema()
savePrismaSchema('test.prisma')