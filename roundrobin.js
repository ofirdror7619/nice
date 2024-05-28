class RoundRobin {
    constructor(workers) {
      this.workers = workers;
      this.currentIndex = 0;
    }
  
    getNextAvailableWorker() {
      let startIndex = this.currentIndex;
      while (true) {
        const worker = this.workers[this.currentIndex];
        if (worker.available) {
          this.currentIndex = (this.currentIndex + 1) % this.workers.length;
          return worker;
        }
        this.currentIndex = (this.currentIndex + 1) % this.workers.length;
        if (this.currentIndex === startIndex) {
          // If we have looped through all objects and none are available, return null
          return null;
        }
      }
    }

    setCurrentWorkerToNotAvailable(worker) {
        worker.available = false;
    }

    setCurrentWorkerToAvailable(worker) {
        worker.available = false;
    }
  }

  module.exports = RoundRobin;
  