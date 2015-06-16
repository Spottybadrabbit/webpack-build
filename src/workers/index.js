import os from 'os';
import _ from 'lodash';
import options from '../options';
import Worker from './Worker';

class Workers {
  constructor() {
    this.workers = [];
    this.next = 0;
    this.matches = Object.create(null);
  }
  hasWorkers() {
    return this.workers.length > 0;
  }
  spawn(number) {
    // Spawns the number of workers specified

    number = number || os.cpus().length;

    _.range(number).forEach(() => {
      this.workers.push(new Worker());
    });
  }
  build(opts, cb) {
    // Passes `opts` to an available worker

    opts = options(opts);

    if (!this.hasWorkers()) {
      return cb(new Error('No workers available'));
    }

    let worker = this.match(opts);

    if (!worker) {
      worker = this.get(worker);
      this.matches[opts.buildHash] = worker.pid;
    }

    worker.build(opts, cb);
  }
  match(opts) {
    // Returns a worker, if any, which has previously build `opts` and is likely
    // to have a warm compiler

    let key = opts.buildHash;
    let pid = this.matches[key];
    if (pid) {
      return _.find(this.workers, { pid });
    }
  }
  get() {
    // Returns the next available worker

    let worker = this.workers[this.next];

    this.next++;
    if (this.next >= this.workers.length) {
      this.next = 0;
    }

    return worker;
  }
  clear() {
    for (let worker of this.workers) {
      worker.kill();
    }
    this.workers = [];
    this.matches = Object.create(null);
    this.next = 0;
  }
}

export default new Workers();