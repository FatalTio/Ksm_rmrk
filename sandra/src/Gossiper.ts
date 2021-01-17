import {EntityFactory} from "./EntityFactory.js";
import {Concept} from "./Concept.js";
import {Entity} from "./Entity";
import {SandraManager} from "./SandraManager.js";

export class Gossiper{

    public entityFactory:EntityFactory ;
    public updateOnReference:Concept ;
    public joinFactoryGossip:Gossiper[];
    public showAllTriplets:boolean = false ;


    public constructor(entityFactory:EntityFactory, updateOnReference:Concept) {

        this.entityFactory = entityFactory ;
        this.updateOnReference = updateOnReference ;
        this.joinFactoryGossip = [];

    }

    public exposeGossip(isFinalFactory:boolean = true){

            let how = this.entityFactory.refMap ;

            let refMap:any = {}
            //Iterate over map entries
            // @ts-ignore
        for (let [key, value] of how){

                refMap[key] = value;
            }


            // @ts-ignore
            for (let entry of this.entityFactory.refMap.entries()) {
                // refMap[entry[0]] = entry[1];
                //console.log(entry);

            }

            let joinedFactoryGossip:Array<any> = [] ;

            this.entityFactory.joinedFactory.forEach(joinFactory =>{

                if (joinFactory.entityFactory !== this.entityFactory) {
                    let joinedGossip = new Gossiper(joinFactory.entityFactory, joinFactory.createOnRef);
                    joinedFactoryGossip.push(joinedGossip.exposeGossip(false)) ;


                }

            })

            let entityArray:Array<Entity> = []

                this.entityFactory.entityArray.forEach(r=>{
                    entityArray.push(this.gossipEntity(r))
                })






            let myData:any = {
                gossiper:{
                  updateOnReferenceShortname:this.updateOnReference.shortname,

                },
                'entityFactory': {
                    'is_a': this.entityFactory.is_a,
                    'contained_in_file': this.entityFactory.contained_in_file,
                    'entityArray': entityArray,
                    'refMap': refMap,
                    'joinedFactory':joinedFactoryGossip
                }

            }

        if (isFinalFactory){
            myData.gossiper.shortNameDictionary = this.buildShortNameDictionary(this.entityFactory.sandraManager) ;

        }


            return myData ;
    }


    public static gossipFactory(entityFactory:EntityFactory,updateOnRefrenceConcept:Concept){


        return new Gossiper(entityFactory,updateOnRefrenceConcept);


    }
    public gossipEntity(entity:Entity){

        let myData:any ={

            id:entity.id,
            subjectUnid:entity.subjectConcept.unid,
            referenceArray:entity.referenceArray

        }




        for (let triplet of entity.subjectConcept.triplets) {

            if (!myData.triplets) myData.triplets = {};
            if (!myData.triplets[triplet[0].shortname]) myData.triplets[triplet[0].shortname] = [];

            triplet[1].forEach(element =>{
                myData.triplets[triplet[0].shortname].push(element.unid) ;

            })

        }




        return myData ;

    }

    public joinFactoryGossiper(gossiper:Gossiper){

        this.joinFactoryGossip.push(gossiper);

    }

    public buildShortNameDictionary(sandra:SandraManager){

        let dictionnary:any = {};

        sandra.conceptList.forEach(element =>{

            dictionnary[element.unid] = element.shortname ;

        })

        return dictionnary ;


    }


}