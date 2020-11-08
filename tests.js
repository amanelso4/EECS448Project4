import * as Game from './game.js';


export class Tester {

    constructor() {
        this.dims = [10, 10, 0, 0];
        this.testComponent = new Game.Component(this.dims[0], this.dims[1], "red", 
                                                this.dims[2], this.dims[3]);
        this.resultsElement = document.getElementById("testResults");
        this.displayTest.num = 1;
    }

    /**
     * Run all tests.
    */
    runTests() {
        this.resultsElement.innerHTML = "";
        this.displayTest(this.testCrashLeftContact);
        this.displayTest(this.testCrashRightContact);
        this.displayTest(this.testCrashTopContact);
        this.displayTest(this.testCrashBottomContact);
    }

    /**
     * Test a given function and display the result.
     * @param {function} test The test function to call and output.
     */
    displayTest = function(test, ctx=this) {

        let result = "PASSED";
        if (!test(ctx)) {
            result = "<b>FAILED</b>";
        }
    
        this.resultsElement.innerHTML += result + ": Test " + this.displayTest.num + ": " + test.name;
        this.resultsElement.innerHTML += ": \"" + test.desc + "\"<br>";
        this.displayTest.num++;
    }

    /**
     * Test that collision happens when a component overlaps another on the left side.
     */
    testCrashLeftContact = function(ctx) {
        ctx.testCrashLeftContact.desc = "Test that collision happens when a component overlaps another on the left side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2]-9, ctx.dims[3]);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the right side.
     */
    testCrashRightContact = function(ctx) {
        ctx.testCrashRightContact.desc = "Test that collision happens when a component overlaps another on the right side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2] + ctx.dims[0]-1, ctx.dims[3]);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the top side.
     */
    testCrashTopContact = function(ctx) {
        ctx.testCrashTopContact.desc = "Test that collision happens when a component overlaps another on the top side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2], ctx.dims[3] - 9);
        return !ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the bottom side.
     */
    testCrashBottomContact = function(ctx) {
        ctx.testCrashBottomContact.desc = "Test that collision happens when a component overlaps another on the bottom side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2], ctx.dims[3] + ctx.dims[1] - 1);
        return ctx.testComponent.crashWith(testObstacle);
    }
}