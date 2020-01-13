import { GQLPage, GQLMediaList, GQLMediaListStatus, GQLUser, GQLQuery } from "../graphql/graphqlTypes";
import { loader } from "graphql.macro";
import { DocumentNode } from "graphql";
import { queryAniList } from "./MainProcessCommunicationUtil";
import { store } from "../index";
import { ISetUser } from "../globalState/actions";
import { AppStateActionTypes } from "../globalState/rootReducer";

const getAnimeListPageQuery = extractQuery(loader("./graphql/queries/GetAnimeListPage.gql"));
const getCurrentUserDataQuery = extractQuery(loader("../../graphql/queries/GetCurrentUserData.gql"));
const getAnimeByIdQuery = extractQuery(loader("../graphql/queries/GetAnimeById.gql"));

function extractQuery(documentNode: DocumentNode) {
    return documentNode.loc?.source.body;
}

export async function getAnimeList(mediaListStatus: GQLMediaListStatus,
    pageSize: number, 
    fromPage: number, 
    untilPage?: number) {
    type TGQLGetAnimeListPageReturnType = {
        data: {
            Page: GQLPage
        }
    }

    let currentPage = fromPage;
    let lastPage = untilPage || Infinity;
    const url = store.getState().anilistApi;
    const pin = store.getState().pin;
    const userId = store.getState().currentUser?.id;
    const mediaList: GQLMediaList[] = [];

    while (currentPage < lastPage) {
      let requestPromiseResult = await queryAniList<TGQLGetAnimeListPageReturnType>(url!,
        pin!,
        getAnimeListPageQuery!,
        {
          page: currentPage,
          perPage: pageSize,
          userId: userId,
          status: mediaListStatus
        });
      if (requestPromiseResult.err) {
        console.error(requestPromiseResult.err);
        break;
      } else {
        currentPage += 1;
        lastPage = requestPromiseResult.body?.data.Page.pageInfo?.lastPage!;
        mediaList.push(...requestPromiseResult.body?.data.Page.mediaList?.map(entry => entry!)!);
      }
    }

    return mediaList;
}

export function getUserData() {
    console.log(JSON.stringify({
        query: getCurrentUserDataQuery
    }));
    const url = store.getState().anilistApi;
    const pin = store.getState().pin;

    console.log(`Querying ${url}`);
    type TGQLGetUserDataReturnType = {
        data: {
            Viewer: GQLUser
        }
    };
    queryAniList<TGQLGetUserDataReturnType>(url!, pin!, getCurrentUserDataQuery!)
        .then(response => {
            store.dispatch({
                type: AppStateActionTypes.SET_USER,
                user: response.body?.data.Viewer
            } as ISetUser);
        })
        .catch(err => console.error(err));
}

export function getAnimeById(id: number) {
    type IGetAnimeById = {
        data: GQLQuery
    };

    const url = store.getState().anilistApi;
    const pin = store.getState().pin;

    return queryAniList<IGetAnimeById>(url!,
        pin!,
        getAnimeByIdQuery!,
        {
            id: id
        });
}