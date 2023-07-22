// User

export interface User {
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

export interface AvatarThumbs {
  c50: string;
  c144: string;
}

export interface HeaderSize {
  width: number;
  height: number;
}

export interface HeaderThumbs {
  w480: string;
  w760: string;
}

export interface SubscriptionBundle {
  id: number;
  discount: number;
  duration: number;
  price: number;
  canBuy: boolean;
}

export interface SubscribedByData {
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

export interface Subscribe {
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

export interface Promotion {
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

export interface ListsState {
  id: number;
  type: string;
  name: string;
  hasUser: boolean;
  canAddUser: boolean;
}

// User Social Buttons

export interface SocialButtons {
  id: number;
  sort: number;
  label: string;
  username: string;
  socialMedia: string;
  link: string;
  url: string;
  isValid: boolean;
}

// Posts

export interface PostsResponse {
  list: Post[];
  hasMore: boolean;
  headMarker: string;
  tailMarker: string;
  counters: Counters;
}

export interface Post {
  responseType: string;
  id: number;
  postedAt: string;
  postedAtPrecise: string;
  expiredAt: any;
  author: Author;
  text: string;
  rawText: string;
  lockedText: boolean;
  isFavorite: boolean;
  canReport: boolean;
  canDelete: boolean;
  canComment: boolean;
  canEdit: boolean;
  isPinned: boolean;
  favoritesCount: number;
  mediaCount: number;
  isMediaReady: boolean;
  voting: any[];
  isOpened: boolean;
  canToggleFavorite: boolean;
  streamId: any;
  price: any;
  hasVoting: boolean;
  isAddedToBookmarks: boolean;
  isArchived: boolean;
  isPrivateArchived: boolean;
  isDeleted: boolean;
  hasUrl: boolean;
  isCouplePeopleMedia: boolean;
  cantCommentReason: string;
  commentsCount: number;
  mentionedUsers: MentionedUser[];
  linkedUsers: LinkedUser[];
  linkedPosts: any[];
  media: Medum[];
  canViewMedia: boolean;
  preview: any[];
}

export interface Author {
  id: number;
  _view: string;
}

export interface MentionedUser {
  id: number;
  _view: string;
}

export interface LinkedUser {
  id: number;
  _view: string;
}

export interface Medum {
  id: number;
  type: string;
  convertedToVideo: boolean;
  canView: boolean;
  hasError: boolean;
  createdAt: string;
  info: Info;
  source: Source;
  squarePreview: string;
  full: string;
  preview: string;
  thumb: string;
  files: Files;
  videoSources: VideoSources;
}

export interface Info {
  source: Source;
  preview: {
    width: number;
    height: number;
    size: number;
  };
}

export interface Source {
  source: string;
  width: number;
  height: number;
  size: number;
  duration: number;
}

export interface Files {
  preview: {
    url: string;
  };
}

export interface VideoSources {
  "720": string;
  "240": string;
}

export interface Counters {
  audiosCount: number;
  photosCount: number;
  videosCount: number;
  mediasCount: number;
  postsCount: number;
  streamsCount: number;
  archivedPostsCount: number;
}
