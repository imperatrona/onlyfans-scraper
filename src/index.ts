import { createHash } from "crypto";
import got, { Agents, HTTPError } from "got";

interface Rules {
	appToken: string;
	staticParam: string;
	prefix: string;
	suffix: string;
	checksum: {
		constant: number;
		indexes: number[];
	};
}

interface Auth {
	userId: string;
	userAgent: string;
	xBc?: string;
	cookie?: string;
}

function sha1(value: string) {
	return createHash("sha1").update(value).digest("hex");
}

class Scrapy {
	#rules: Rules = {
		appToken: "33d57ade8c02dbc5a333db99ff9ae26a",
		staticParam: "QAIvost4f5b29nagfmKtMqEXjDgRptq0",
		prefix: "7865",
		suffix: "6436c06b",
		checksum: {
			constant: 72,
			indexes: [
				0, 0, 2, 2, 2, 3, 3, 4, 9, 10, 10, 13, 14, 16, 17, 19, 20, 21, 22, 24,
				25, 26, 26, 27, 31, 32, 32, 33, 35, 36, 37, 39,
			],
		},
	};

	auth: Auth = {
		userId: "0",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
	};

	agent: Agents | undefined = undefined;

	constructor(data?: Auth) {
		this.auth = {
			...this.auth,
			xBc: this.#generateXBc(),
			...data,
		};
	}

	setProxy(agents: Agents) {
		this.agent = agents;
	}

	#generateXBc(): string {
		const parts = [
			new Date().getTime(),
			1e12 * Math.random(),
			1e12 * Math.random(),
			this.auth.userAgent,
		];
		const msg = parts
			.map((value) => Buffer.from(value.toString()).toString("base64"))
			.join(".");
		const token: string = sha1(msg);

		return token;
	}

	/**
	 * Get cookies if not defined, used for anonymous client
	 * @private
	 */
	async #init() {
		const PATH = "/api2/v2/init";

		const data = await got.get(`https://onlyfans.com${PATH}`, {
			headers: this.#createHeaders(PATH),
			agent: this.agent,
		});

		if (data.ok) {
			const cookies = data.headers["set-cookie"];
			if (cookies) {
				this.auth.cookie = cookies
					.map((entry: string) => {
						const parts = entry.split(";");
						const cookiePart = parts[0];
						return cookiePart;
					})
					.join("; ");
			}
		}

		return data;
	}

	#createHeaders(path: string) {
		const time = Date.now().toString();
		const hash = sha1(
			[this.#rules.staticParam, time, path, this.auth.userId].join("\n"),
		);
		const checksum =
			this.#rules.checksum.indexes.reduce(
				(total: number, current: number) => total + hash[current].charCodeAt(0),
				0,
			) + this.#rules.checksum.constant;
		const sign = [
			this.#rules.prefix,
			hash,
			checksum.toString(16),
			this.#rules.suffix,
		].join(":");

		if (!this.auth.xBc) throw new Error("Unauthorized: xbc not generated");

		const headers: { [key: string]: string } = {
			accept: "application/json, text/plain, */*",
			"app-token": this.#rules.appToken,
			sign: sign,
			time: time,
			"user-agent": this.auth.userAgent,
			"x-bc": this.auth.xBc,
		};

		if (this.auth.cookie) {
			headers["cookie"] = this.auth.cookie;
		}
		if (this.auth.userId && this.auth.userId !== "0") {
			headers["user-id"] = this.auth.userId;
		}

		return headers;
	}

	async getUser(username: string) {
		if (!this.auth.cookie) {
			try {
				await this.#init();
			} catch (error) {
				if (error instanceof HTTPError) {
					console.error(error.message);
				}
			}
		}

		const PATH = `/api2/v2/users/${username}`;

		const data = await got
			.get(`https://onlyfans.com${PATH}`, {
				headers: this.#createHeaders(PATH),
				agent: this.agent,
			})
			.json<User>();

		return data;
	}

	GetSession() {
		return this.auth;
	}
}

export default Scrapy;

interface User {
	view: string;
	avatar: string;
	avatarThumbs: AvatarThumbs;
	header: string;
	headerSize: HeaderSize;
	headerThumbs: HeaderThumbs;
	id: number;
	name: string;
	username: string;
	canLookStory: boolean;
	canCommentStory: boolean;
	hasNotViewedStory: boolean;
	isVerified: boolean;
	canPayInternal: boolean;
	hasScheduledStream: boolean;
	hasStream: boolean;
	hasStories: boolean;
	tipsEnabled: boolean;
	tipsTextEnabled: boolean;
	tipsMin: number;
	tipsMinInternal: number;
	tipsMax: number;
	canEarn: boolean;
	canAddSubscriber: boolean;
	subscribePrice: number;
	subscriptionBundles?: SubscriptionBundle[];
	unprofitable: boolean;
	isMuted: boolean;
	isRestricted: boolean;
	canRestrict: boolean;
	subscribedBy?: boolean;
	subscribedByExpire?: boolean;
	subscribedByExpireDate?: string;
	subscribedByAutoprolong?: boolean;
	subscribedIsExpiredNow?: boolean;
	currentSubscribePrice?: number;
	subscribedOn: boolean;
	subscribedOnExpiredNow: any;
	subscribedOnDuration: any;
	joinDate: string;
	isReferrerAllowed: boolean;
	about: string;
	rawAbout: string;
	website?: string;
	wishlist?: string;
	location?: string;
	postsCount: number;
	archivedPostsCount: number;
	privateArchivedPostsCount: number;
	photosCount: number;
	videosCount: number;
	audiosCount: number;
	mediasCount: number;
	lastSeen?: string;
	favoritesCount: number;
	favoritedCount: number;
	showPostsInFeed: boolean;
	canReceiveChatMessage: boolean;
	isPerformer: boolean;
	isRealPerformer: boolean;
	isSpotifyConnected: boolean;
	subscribersCount: null | number;
	hasPinnedPosts: boolean;
	hasLabels: boolean;
	canChat: boolean;
	callPrice: number;
	isPrivateRestriction: boolean;
	showSubscribersCount: boolean;
	showMediaCount: boolean;
	subscribedByData?: SubscribedByData;
	subscribedOnData: any;
	canPromotion: boolean;
	canCreatePromotion: boolean;
	canCreateTrial: boolean;
	isAdultContent: boolean;
	canTrialSend: boolean;
	hadEnoughLastPhotos: boolean;
	hasLinks: boolean;
	promotions?: Promotion[];
	referalBonusSummForReferer?: number;
	firstPublishedPostDate: string;
	isSpringConnected: boolean;
	isFriend: boolean;
	isBlocked: boolean;
	canReport: boolean;
	finishedStreamsCount?: number;
	shouldShowFinishedStreams?: boolean;
	hasSavedStreams?: boolean;
	isPaywallRequired?: boolean;
	listsStates?: ListsState[];
	hasFriends?: boolean;
}

interface AvatarThumbs {
	c50: string;
	c144: string;
}

interface HeaderSize {
	width: number;
	height: number;
}

interface HeaderThumbs {
	w480: string;
	w760: string;
}

interface SubscriptionBundle {
	id: number;
	discount: number;
	duration: number;
	price: number;
	canBuy: boolean;
}

interface SubscribedByData {
	price: number;
	newPrice: number;
	regularPrice: number;
	subscribePrice: number;
	discountPercent: number;
	discountPeriod: number;
	subscribeAt: string;
	expiredAt: string;
	renewedAt?: string;
	discountFinishedAt: any;
	discountStartedAt: any;
	status: any;
	isMuted: boolean;
	unsubscribeReason: string;
	duration: string;
	showPostsInFeed: boolean;
	newPostsAfterExpireCount?: number;
	subscribes: Subscribe[];
	hasActivePaidSubscriptions: boolean;
}

interface Subscribe {
	id: number;
	userId: number;
	subscriberId: number;
	date: string;
	duration: number;
	startDate: string;
	expireDate: string;
	cancelDate: any;
	price: number;
	regularPrice: number;
	discount: number;
	earningId: number;
	action: string;
	type: string;
	offerStart: any;
	offerEnd: any;
	isCurrent: boolean;
}

interface Promotion {
	id: number;
	message: string;
	rawMessage: string;
	hasRelatedPromo: boolean;
	price: number;
	type: string;
	canClaim: boolean;
	claimsCount: number;
	subscribeCounts: any;
	subscribeDays: number;
	createdAt: string;
	finishedAt?: string;
	isFinished: boolean;
}

interface ListsState {
	id: number;
	type: string;
	name: string;
	hasUser: boolean;
	canAddUser: boolean;
}
