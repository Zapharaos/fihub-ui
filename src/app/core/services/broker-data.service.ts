import { Injectable } from '@angular/core';
import {BrokerImagesService, BrokersBroker, BrokersService, BrokersUserBroker, UserBrokerService} from "@core/api";
import {forkJoin, map, Observable, of, switchMap, tap} from "rxjs";

// Export a type that extends BrokersBroker and adds an imageUrl property
export type BrokerWithImage = BrokersBroker & { imageUrl?: string };
export type UserBrokerWithImage = Omit<BrokersUserBroker, 'broker'> & { broker: BrokerWithImage };

@Injectable({
  providedIn: 'root'
})
export class BrokerDataService {

  constructor(
    private brokersService: BrokersService,
    private brokerImagesService: BrokerImagesService,
    private userBrokerService: UserBrokerService
  ) {}

  getBrokersWithImages(): Observable<BrokerWithImage[]> {
    // Fetch brokers from the service
    return this.brokersService.getBrokers().pipe(
      switchMap((brokers: BrokersBroker[]) => {
        // For each broker, fetch the corresponding image
        const brokerImageRequests = brokers.map(broker => {
          // If the broker does not have an image, return the broker as is
          if (!broker.image_id) {
            return of(broker);
          }
          // Fetch the broker image and map it to the broker
          return this.brokerImagesService.getBrokerImage(broker.id!, broker.image_id).pipe(
            map(image => ({
              ...broker,
              imageUrl: URL.createObjectURL(image)
            }))
          )
        });

        // Combine all image requests into a single observable
        return forkJoin(brokerImageRequests).pipe(
          // Cache the brokers with images and return them
          tap({
            next: brokersWithImages => brokersWithImages
          })
        );
      })
    );
  }

  getUsersBrokersWithImages(): Observable<UserBrokerWithImage[]> {
    // Fetch brokers from the service
    return this.userBrokerService.getUserBrokers().pipe(
      switchMap((userBrokers: BrokersUserBroker[]) => {
        // For each userBroker, fetch the corresponding image
        const userBrokerImageRequests = userBrokers.map(userBroker => {
          // If the broker does not have an image, return the broker as is
          if (!userBroker.broker?.image_id) {
            return of({
              ...userBroker,
              broker: {
                ...userBroker.broker,
                imageUrl: undefined
              }
            } as UserBrokerWithImage);
          }
          // Fetch the broker image and map it to the broker
          return this.brokerImagesService.getBrokerImage(userBroker.broker.id!, userBroker.broker.image_id).pipe(
            map(image => ({
              ...userBroker,
              broker: {
                ...userBroker.broker,
                imageUrl: URL.createObjectURL(image)
              }
            } as UserBrokerWithImage))
          );
        });

        // Combine all image requests into a single observable
        return forkJoin(userBrokerImageRequests).pipe(
          // Cache the brokers with images and return them
          tap({
            next: brokersWithImages => brokersWithImages
          })
        );
      })
    );
  }
}
