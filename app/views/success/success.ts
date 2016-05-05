// includes
import enumsModule = require("ui/enums");

// TS Typings
import {Page} from "ui/page";
import {getViewById} from "ui/core/view";
import {EventData} from "data/observable";
import {Label} from "ui/label";

let page: Page;

exports.loaded = function (eventData: EventData) {
    page = <Page> eventData.object;
    let successLabel = <Label>getViewById(page, "success-message");

    successLabel.animate({
        translate: {x: 0, y: 100},
        duration: 500,
        curve: enumsModule.AnimationCurve.easeIn
    })
};