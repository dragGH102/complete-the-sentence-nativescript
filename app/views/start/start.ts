// includes
import * as config from "../../shared/config";
import labelModule = require("ui/label");
import frameModule = require("ui/frame");

// TS typings
import {getViewById} from "ui/core/view";
import {Page} from "ui/page";
import {Label} from "ui/label";
import {EventData} from "data/observable";
import {WrapLayout} from "ui/layouts/wrap-layout";
declare var shuffleArray: any;//

let sentenceContainer: WrapLayout,
    wildcardContainer: WrapLayout,
    page: Page,
    textParts: Array<string>,
    label: Label,
    wildcardCount: number;

// app lifecycle events
exports.loaded = function (eventData) {
    let jsonString: string = <string>config.jsonString,
        completeSentence: string  = <string>config.completeSentence,
        missingWords: Array<string> = <Array<string>>config.missingWords;

    page = <Page>eventData.object;
    wildcardCount = <number>missingWords.length;
    textParts = <Array<string>>parseJsonString(jsonString);

    sentenceContainer = <WrapLayout>getViewById(page, "sentence-container");
    wildcardContainer = <WrapLayout>getViewById(page, "wildcard-container");

    // assume first word is not a wildcard and at least one space between each wildcard/word
    textParts.forEach(function(part, index) {
        // sentence part
        label = new labelModule.Label();
        label.text = part;
        sentenceContainer.addChild(label);

        if (index == wildcardCount) return;

        // wildcard space
        label = new labelModule.Label();
        label.cssClass = "wildcard";

        label.on("tap", function(eventData: EventData){
            // nothing should happen when no wildcards were added
            if (wildcardContainer.getChildrenCount() == wildcardCount) return;

            let sentenceWildcard = <Label>eventData.object;

            // restore wildcard
            label = new labelModule.Label();
            label.cssClass = "wildcard";
            label.text = sentenceWildcard.text;
            label.on("tap", function(eventData: EventData) {
                handleWildcardTap(<Label>eventData.object, completeSentence);
            });
            wildcardContainer.addChild(label);

            // remove wildcard from sentence
            sentenceWildcard.text = "";

        });

        sentenceContainer.addChild(label);
    });

    // show wildcards in random order
    shuffleArray(missingWords).forEach(function(word) {
        label = new labelModule.Label();
        label.text = word;
        label.cssClass = "wildcard";

        label.on("tap", function(eventData: EventData) {
            handleWildcardTap(<Label>eventData.object, completeSentence);
        });

        wildcardContainer.addChild(label);
    });


};

/** auxiliary functions */
export function parseJsonString(jsonString: string) {
    let textParts: Array<String>;

    let regex = /\$[0-9]/;
    textParts = jsonString.split(regex);

    return textParts;
}

function handleWildcardTap(label: Label, completeSentence: string) {
    // add wildcard to sentence
    let sentenceWildcard = <Label>sentenceContainer.getChildAt(getFirstEmptyWildcardIndex());
    sentenceWildcard.text = label.text;

    // remove wildcard
    wildcardContainer.removeChild(label);

    // check whether sentence is complete and correct
    if (wildcardContainer.getChildrenCount() == 0) checkSentence(completeSentence);
}

function getFirstEmptyWildcardIndex(){
    let firstEmptyWildcard = -1;

    sentenceContainer.eachLayoutChild(function(child: Label){
        if (firstEmptyWildcard!=-1) return;
        if (child.cssClass=="wildcard" && child.text=="") firstEmptyWildcard = sentenceContainer.getChildIndex(child);
    });

    return firstEmptyWildcard;
}

function checkSentence(completeSentence: string){
    let sentence = "";

    sentenceContainer.eachLayoutChild(function(child: Label){
        sentence+= child.text;
    });

    if (completeSentence == sentence){
        setTimeout(function() {
            frameModule.topmost().navigate("views/success/success");
        }, 1000);
    }

    return true;
}

