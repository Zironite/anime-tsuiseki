/* tslint:disable */
/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
/**
 * This file is auto-generated by graphql-schema-typescript
 * Please note that any changes in this file may be overwritten
 */
 

/*******************************
 *                             *
 *          TYPE DEFS          *
 *                             *
 *******************************/
export interface GQLQuery {
  Viewer?: GQLUser;
}

export interface GQLUser {
  id: number;
  name: string;
  avatar?: GQLUserAvatar;
}

export interface GQLUserAvatar {
  large?: string;
  medium?: string;
}

/*********************************
 *                               *
 *         TYPE RESOLVERS        *
 *                               *
 *********************************/
/**
 * This interface define the shape of your resolver
 * Note that this type is designed to be compatible with graphql-tools resolvers
 * However, you can still use other generated interfaces to make your resolver type-safed
 */
export interface GQLResolver {
  Query?: GQLQueryTypeResolver;
  User?: GQLUserTypeResolver;
  UserAvatar?: GQLUserAvatarTypeResolver;
}
export interface GQLQueryTypeResolver<TParent = any> {
  Viewer?: QueryToViewerResolver<TParent>;
}

export interface QueryToViewerResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLUserTypeResolver<TParent = any> {
  id?: UserToIdResolver<TParent>;
  name?: UserToNameResolver<TParent>;
  avatar?: UserToAvatarResolver<TParent>;
}

export interface UserToIdResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToNameResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserToAvatarResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface GQLUserAvatarTypeResolver<TParent = any> {
  large?: UserAvatarToLargeResolver<TParent>;
  medium?: UserAvatarToMediumResolver<TParent>;
}

export interface UserAvatarToLargeResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}

export interface UserAvatarToMediumResolver<TParent = any, TResult = any> {
  (parent: TParent, args: {}, context: any, info: GraphQLResolveInfo): TResult;
}
