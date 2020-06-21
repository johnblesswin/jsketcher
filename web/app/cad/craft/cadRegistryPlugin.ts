import {MShell} from '../model/mshell';
import {MObject} from "../model/mobject";
import {ApplicationContext} from "context";


export function activate(ctx: ApplicationContext) {
  const {streams, services} = ctx;

  const shells$ = streams.craft.models.map(models => models.filter(m => m instanceof MShell)).remember();
  const modelIndex$ = streams.craft.models.map(models => {
    const index = new Map();
    models.forEach(model => model.traverse(m => index.set(m.id, m)));
    return index;
  }).remember();

  streams.cadRegistry = {
    shells: shells$, modelIndex: modelIndex$
  };

  streams.cadRegistry.update = streams.cadRegistry.modelIndex;

  const index = () => modelIndex$.value;

  function getAllShells() {
    return streams.cadRegistry.shells.value;
  }

  function findShell(shellId) {
    return index().get(shellId);
  }

  function findFace(faceId) {
    return index().get(faceId);
  }

  function findEdge(edgeId) {
    return index().get(edgeId);
  }

  function findSketchObject(sketchObjectGlobalId) {
    return index().get(sketchObjectGlobalId);
  }

  function findDatum(datumId) {
    return index().get(datumId);
  }

  function findDatumAxis(datumAxisId) {
    return index().get(datumAxisId);
  }
  
  function findLoop(loopId) {
    return index().get(loopId);
  }

  function findEntity(entity, id) {
    return index().get(id);
  }

  function find(id) {
    return index().get(id);
  }

  services.cadRegistry = {
    getAllShells, findShell, findFace, findEdge, findSketchObject, findEntity, findDatum, findDatumAxis, findLoop, find,
    get modelIndex() {
      return streams.cadRegistry.modelIndex.value;
    },
    get models() {
      return streams.craft.models.value;
    },
    get shells() {
      return getAllShells();
    }
  };
  ctx.cadRegistry = services.cadRegistry;
}


export interface CadRegistry {

  getAllShells(): MObject[];
  findShell(id: string): MObject;
  findFace(id: string): MObject;
  findEdge(id: string): MObject;
  findSketchObject(id: string): MObject;
  findEntity(id: string): MObject;
  findEntity(id: string): MObject;
  findDatum(id: string): MObject;
  findDatumAxis(id: string): MObject;
  findLoop(id: string): MObject;
  find(id: string): MObject;
  modelIndex: Map<String, MObject>;
  models: MObject[];
  shells: MObject[];

}

declare module 'context' {
  interface ApplicationContext {

    cadRegistry: CadRegistry;
  }
}
