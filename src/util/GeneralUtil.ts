import { GQLMediaFormat } from "../graphql/graphqlTypes";

export function humanMediaFormat(format?: GQLMediaFormat) {
    switch (format) {
        case GQLMediaFormat.MANGA:
            return "Manga";
        case GQLMediaFormat.MOVIE:
            return "Movie";
        case GQLMediaFormat.MUSIC:
            return "Music";
        case GQLMediaFormat.NOVEL:
            return "Novel";
        case GQLMediaFormat.ONA:
            return "ONA";
        case GQLMediaFormat.ONE_SHOT:
            return "One Shot";
        case GQLMediaFormat.OVA:
            return "OVA";
        case GQLMediaFormat.SPECIAL:
            return "Special";
        case GQLMediaFormat.TV:
            return "TV";
        case GQLMediaFormat.TV_SHORT:
            return "TV Short";
        default:
            return null;
    }
}