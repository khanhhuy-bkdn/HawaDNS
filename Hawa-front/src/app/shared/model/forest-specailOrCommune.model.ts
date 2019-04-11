import { TreeSpecies } from "./dictionary/tree-species.model";
import { Dictionary } from "./dictionary/dictionary.model";
import { Actor } from "./dictionary/actor.model";
import { ActorType } from "./dictionary/actor-type.model";

export class ForestSpecailOrCommune {
    id: number;
    treeSpec: TreeSpecies;
    compartment: Dictionary;
    compartmentCode: String;
    subCompartment: Dictionary;
    subCompartmentCode: string;
    plot: Dictionary;
    plotCode: String;
    volumnPerPlot: number;
    area: number;
    plantingYear: number;
    dispute: Dictionary;
    actor: Actor;
    actorType: ActorType;
    forestCert: Dictionary;
    reliability: Dictionary;
    landUseCert: Dictionary;
    conflictSitCode: number;
    locationLatitude: number;
    locationLongitude: number;
}