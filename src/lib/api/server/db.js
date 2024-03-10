import { DataTypes, Model, Sequelize } from 'sequelize';

export const sequelize = new Sequelize('db', 'user', 'pass', {
	host: 'localhost',
	dialect: 'sqlite',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	storage: './mrmNode/database.sqlite',
	logging: false
});

export function paginate(query, { page, pageSize }) {
	const offset = page * pageSize;
	const limit = pageSize;

	return {
		...query,
		offset,
		limit
	};
}

export const Asset = sequelize.define('asset', {
	id: {
		primaryKey: true,
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4
	},
	indexInChapter: DataTypes.INTEGER
});

export const AssetVersion = sequelize.define('assetData', {
	path: { type: DataTypes.STRING, allowNull: false },
	width: { type: DataTypes.NUMBER, allowNull: false },
	height: { type: DataTypes.NUMBER, allowNull: false },
	lang: { type: DataTypes.STRING, allowNull: false },
	format: { type: DataTypes.STRING, allowNull: false },
	etag: { type: DataTypes.STRING, allowNull: false },
	contentLength: { type: DataTypes.NUMBER, allowNull: false },
	mimeType: { type: DataTypes.STRING, allowNull: false },
	httpUrl: { type: DataTypes.STRING, allowNull: true }
});
Asset.hasMany(AssetVersion);
AssetVersion.belongsTo(Asset);

export const Chapter = sequelize.define('chapter', {
	published: DataTypes.BOOLEAN,
	indexInParentPost: DataTypes.INTEGER,
	name: DataTypes.STRING,
	western: DataTypes.BOOLEAN,
	sensitiveContent: DataTypes.BOOLEAN
});
Chapter.hasMany(Asset);
Asset.belongsTo(Chapter);

export class AssetBucket extends Model {}

AssetBucket.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		snowflake: {
			type: DataTypes.STRING
		}
	},
	{
		sequelize,
		modelName: 'AssetBucket'
	}
);

Asset.belongsTo(AssetBucket);
AssetBucket.hasMany(Asset);

export const Post = sequelize.define('post', {
	id: { type: DataTypes.STRING, primaryKey: true },
	title: DataTypes.STRING,
	created: DataTypes.STRING,
	published: DataTypes.BOOLEAN,
	posterAssetId: DataTypes.STRING,
	chapterCount: DataTypes.INTEGER,
	altTitle: DataTypes.STRING,
	description: DataTypes.STRING,
	indexInSeries: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
});
Post.hasMany(Chapter);
Chapter.belongsTo(Post);

export const Series = sequelize.define('series', {
	name: DataTypes.STRING
});
Post.belongsTo(Series, { through: 'seriesPost' });
Series.hasMany(Post);

export const Category = sequelize.define('category', {
	name: DataTypes.STRING
});
Post.belongsToMany(Category, { through: 'categoryPost' });

Category.hasMany(Post);
export const Author = sequelize.define('Author', {
	name: DataTypes.STRING,
	longName: DataTypes.STRING
});
Post.belongsTo(Author, { through: 'authorPost' });

Author.hasMany(Post);
export const Genere = sequelize.define('genere', {
	name: DataTypes.STRING
});
Post.belongsToMany(Genere, { through: 'generePost' });

Genere.hasMany(Post);
export const Tag = sequelize.define('tag', {
	name: DataTypes.STRING
});
Post.belongsToMany(Tag, { through: 'tagPost' });

Tag.hasMany(Post);
export const Pairing = sequelize.define('pairing', {
	name: DataTypes.STRING
});
Post.belongsTo(Pairing, { through: 'pairingPost' });

Pairing.hasMany(Post);
export const Scanlination = sequelize.define('scanlination', {
	groupName: DataTypes.STRING
});
Post.belongsTo(Scanlination, { through: 'scanlinationPost' });

Scanlination.hasMany(Post);
export const Status = sequelize.define('status', {
	name: DataTypes.STRING
});
Post.belongsTo(Status, { through: 'statusPost' });

Status.hasMany(Post);

export const User = sequelize.define('user', {
	username: { type: DataTypes.STRING, unique: true },
	email: DataTypes.STRING,
	passHash: DataTypes.STRING,
	salt: DataTypes.STRING,
	admin: DataTypes.BOOLEAN
});

export const Bookmark = sequelize.define('bookmark', {
	note: DataTypes.STRING
});
Bookmark.belongsTo(User, { through: 'userBookmark' });
User.hasMany(Bookmark);

Bookmark.belongsTo(Post, { through: 'postBookmark' });
Post.hasMany(Bookmark);

export const View = sequelize.define('view', {
	postId: DataTypes.STRING,
	chapterId: DataTypes.STRING
});

export const PasskeyCredentials = sequelize.define('passkeyCredentials', {
	credId: DataTypes.STRING,
	pubKey: DataTypes.STRING,
	counter: DataTypes.INTEGER,
	credentialDeviceType: DataTypes.STRING,
	credentialBackedUp: DataTypes.STRING,
	transports: DataTypes.STRING
});

export const PasskeyChallenges = sequelize.define('passkeyChallanges', {
	challenge: {
		type: DataTypes.STRING,
		required: true
	},
	sessionId: {
		type: DataTypes.STRING,
		required: true
	}
});

PasskeyCredentials.belongsTo(User, { through: 'userPasskey' });
User.hasMany(PasskeyCredentials);
