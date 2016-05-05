// TS Typings
declare var assert, describe, it;

import {parseJsonString} from "./../views/start/start";

// testing with Karma+MochaJS
// NOTE: UI testing (getFirstEmptyWildcardIndex, checkSentence) is not possible unless created by Javascript (e.g.  page.addChild(new stacklayoutModule.StackLayout())

describe('DC Tech Case', function () {
    describe('#parseJsonString()', function () {
        it('parseJsonString should return parts of the original sentence', function () {
            // deepEqual required to test array equality
            assert.deepEqual(parseJsonString("hello $1 name"),["hello ", " name"]);
            assert.deepEqual(parseJsonString("hello $1 name $2 Manuel"),["hello ", " name ", " Manuel"]);
        });
    });
});