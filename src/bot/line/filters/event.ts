import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter } from '@line/filter';

export const Single = createFilter(isSingleEvent);

export const Group = createFilter(isGroupEvent);
export const GroupId = createFilter(event => (isGroupEvent(event) ? event.source.groupId : false));
export const MemberJoin = createFilter(event => event.type === 'memberJoined');
export const MemberLeft = createFilter(event => event.type === 'memberLeft');
export const LeaveGroup = createFilter(event => event.type === 'leave');
