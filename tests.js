import * as Game from './game.js';


/**
 * Wrap all test code in a single class which can be imported elsewhere.
 */
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

        // Find all methods which act as tests and run them
        for (let property of Object.getOwnPropertyNames(this)) {
            if (typeof this[property] === "function" && property.startsWith("test")) {
                this.displayTest(this[property]);
            }
        }
    }

    /**
     * Test a given function and display the result.
     * @param {function} test The test function to call and output.
     */
    displayTest = function(test, ctx=this) {

        let result = "<b>PASSED";
        if (!test(ctx)) {
            result = "<b><u>FAILED</u>";
        }
    
        this.resultsElement.innerHTML += result + ":</b> Test " + this.displayTest.num + ": <b>" + test.name;
        this.resultsElement.innerHTML += ":</b> <i>" + test.desc + "</i><br>";
        this.displayTest.num++;
    }

    /**
     * Test that collision happens when a component overlaps another on the left side.
     * @param {Tester} ctx The Tester running this test
     */
    testCrashLeftContact = function(ctx) {
        ctx.testCrashLeftContact.desc = "Test that collision happens when a component overlaps another on the left side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2]-9, ctx.dims[3]);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the right side.
     * @param {Tester} ctx The Tester running this test
     */
    testCrashRightContact = function(ctx) {
        ctx.testCrashRightContact.desc = "Test that collision happens when a component overlaps another on the right side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2] + ctx.dims[0]-1, ctx.dims[3]);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the top side.
     * @param {Tester} ctx The Tester running this test
     */
    testCrashTopContact = function(ctx) {
        ctx.testCrashTopContact.desc = "Test that collision happens when a component overlaps another on the top side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2], ctx.dims[3] - 9);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the bottom side.
     * @param {Tester} ctx The Tester running this test
     */
    testCrashBottomContact = function(ctx) {
        ctx.testCrashBottomContact.desc = "Test that collision happens when a component overlaps another on the bottom side.";
        let testObstacle = new Game.Component(10, 10, ctx.dims[2], ctx.dims[3] + ctx.dims[1] - 1);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component is inside another.
     * @param {Tester} ctx The Tester running this test
     */
    testCrashInside = function(ctx) {
        ctx.testCrashInside.desc = "Test that collision happens when a component is inside another.";
        let testObstacle = new Game.Component(5, 5, ctx.dims[2] + 2, ctx.dims[3] + 2);
        return ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that no collision happens when a component is outside another.
     */
    testNoCrashOutside = function(ctx) {
        ctx.testNoCrashOutside.desc = "Test that no collision happens when a component is outside another.";
        let testObstacle = new Game.Component(5, 5, ctx.dims[2] + 15, ctx.dims[3] + 15);
        return !ctx.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that a cloud moves backwards only.
     * @param {Tester} ctx The Tester running this test
     */
    testCloudMoveBack = function(ctx) {
        ctx.testCloudMoveBack.desc = "Test that a cloud moves backwards only.";
        let testCloud = new Game.Cloud(5, 5);
        testCloud.move();
        testCloud.move();
        testCloud.move();
        return testCloud.x < 5;
    }
    /**
     * Test that an obstacle moves backwards only.
     * @param {Tester} ctx The Tester running this test
     */
    testObstacleMoveBack = function(ctx) {
        ctx.testObstacleMoveBack.desc = "Test that an obstacle moves backwards only.";
        let testObstacle = new Game.Obstacle();
        let x = testObstacle.x;
        testObstacle.move();
        testObstacle.move();
        testObstacle.move();
        return testObstacle.x < x;
    }
}