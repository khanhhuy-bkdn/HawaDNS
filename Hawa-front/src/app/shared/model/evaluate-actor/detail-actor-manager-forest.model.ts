import { Image } from "../dictionary/image.model";
import { Dictionary } from "../dictionary/dictionary.model";
import { TreeSpecies } from "../dictionary/tree-species.model";
import { ActorType } from "../dictionary/actor-type.model";

export class DetailActorManagerForest {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    avatar: Image;
    averageRating: number;
    roles: Dictionary[];
    type: ActorType;
    identityCard: string;
    acronymName: string;
    representative: string;
    fax: string;
    address: string;
    houseNumber: string;
    stateProvince: Dictionary;
    district: Dictionary;
    commune: Dictionary;
    status: Dictionary;
    aggregateOfRatings: {
        rating: number;
        percent: number;
    } [];
    reviews: {
        id: number;
        reviewUser: {
            id: number;
            email: string;
            type: Dictionary;
            organizationName: string;
            acronymName: string;
            phone: string;
            avatar: Image;
            stateProvince: Dictionary;
            district: Dictionary;
            commune: Dictionary;
            status: Dictionary;
        }
        rating: number;
        title: string;
        content: string;
        reviewDate: number;
        forestPlot: {
            id: number;
            treeSpec: TreeSpecies;
            compartment: Dictionary;
            subCompartment: Dictionary;
            plot: Dictionary;
            volumnPerPlot: number;
            area: number;
            plantingYear: number;
            actorType: {
                id: number;
                name: string;
                code: string;
                acronymName: string;
            }
            forestCert: Dictionary;
            reliability: Dictionary;
            compartmentCode: string;
            subCompartmentCode: string;
            plotCode: string;
        }
    } [];
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
}