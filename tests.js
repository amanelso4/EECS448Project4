import * as game from game;


/**
 * Run all tests.
 */
function runTests() {
    componentTests = new ComponentTests();
    
}

function displayTest(test) {
    
}


class ComponentTests {

    constructor() {
        this.dims = [10, 10, 0, 0];
        this.testComponent = game.Component(this.dims[0], this.dims[1], "red", 
                                            this.dims[2], this.dims[3]);
    }

    /**
     * Test that collision happens when a component overlaps another on the left side.
     */
    testCrashLeftContact = function () {
        testObstacle = game.Component(10, 10, this.dims[2]-9, this.dims[3]);
        return this.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the right side.
     */
    testCrashRightContact = function () {
        testObstacle = game.Component(10, 10, this.dims[2] + this.dims[0]-1, this.dims[3]);
        return this.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the top side.
     */
    testCrashTopContact = function () {
        testObstacle = game.Component(10, 10, this.dims[2], this.dims[3] - 9);
        return this.testComponent.crashWith(testObstacle);
    }
    /**
     * Test that collision happens when a component overlaps another on the bottom side.
     */
    testCrashBottomContact = function () {
        testObstacle = game.Component(10, 10, this.dims[2], this.dims[3] + this.dims[1] - 1);
        return this.testComponent.crashWith(testObstacle);
    }


}