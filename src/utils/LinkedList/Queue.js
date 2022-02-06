import { LinkedList } from './LinkedList';

export class Queue {
    constructor(maxSize = Infinity) {
      this.queue = new LinkedList();
      this.maxSize = maxSize;
      this.size = 0;
    }
  
    isEmpty() {
      return this.size === 0;
    }
  
    hasRoom() {
      return this.size < this.maxSize;
    }
  
    enqueue(data) {
      if(!this.hasRoom()){
        throw new Error('Queue is full!');
        return;
      }
      this.queue.addToTail(data);
      this.size++;
    }
  
    dequeue() {
      if (!this.isEmpty()) {
        const data = this.queue.removeHead();
        this.size--;
        return data;
      } else {
        throw new Error("Queue is empty!");
      }
    }
  }