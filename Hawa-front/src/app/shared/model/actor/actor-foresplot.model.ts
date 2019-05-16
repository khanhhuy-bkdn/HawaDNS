import { ReviewItem } from "../dictionary/review-item.model";
import { Dictionary } from "../dictionary/dictionary.model";
import { TreeSpecies } from "../dictionary/tree-species.model";

export class ActorForesplot {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    avatar: {
        guid: string,
        thumbSizeUrl: string,
        largeSizeUrl: string
    };
    averageRating: number;
    
    aggregateOfRatings: {
        rating: number,
        percent: number,
    }[];
    reviews: ReviewItem[];
    forestPlot: {
        stateProvince: Dictionary;
        district: Dictionary;
        commune: Dictionary;
        treeSpec: TreeSpecies;
        volumnPerPlot: number;
        area: number;
        compartment: Dictionary;
        subCompartment: Dictionary;
        plotCode: string;
    }
    contactName: string;
    contactPhone: string;
    note: string;
}