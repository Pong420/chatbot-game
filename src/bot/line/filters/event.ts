import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter } from '@line/filter';

export const Single = createFilter(isSingleEvent);

export const Group = createFilter(event => (isGroupEvent(event) ? event : false));
export const MemberJoin = createFilter(event => event.type === 'memberJoined');
export const MemberLeft = createFilter(event => event.type === 'memberLeft');
export const LeaveGroup = createFilter(event => event.type === 'leave');
