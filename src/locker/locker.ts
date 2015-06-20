///<reference path="../../typings/tsd.d.ts"/>

module locker {

    export interface ILocker {
        /**
         * Lock entity, which means checking if some item already was locked and if so return false,
         * but if this the first lock, lock it and return true.
         * @param id
         * Lock id
         */
        lock(id: string) : Promise<boolean>
    }

}
