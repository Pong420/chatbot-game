import { createHandler } from '../handler';
import { Group, Single, TextEqual, UserId } from '../filter';

export const testHandlers = [
  createHandler(Single, TextEqual('ping'), () => 'pong'),
  createHandler(Group, TextEqual('What is the group id'), event => `The group id is ${event.source.groupId}`),
  createHandler(UserId(), TextEqual('What is my user id'), userId => `You user id is ${userId}`)
];

export default testHandlers;
