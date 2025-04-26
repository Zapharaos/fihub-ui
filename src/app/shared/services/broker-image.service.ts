import { Injectable } from '@angular/core';
import {
  BrokerImagesService,
  ModelsBroker,
  BrokersService,
  ModelsBrokerUser, TransactionsService,
  ModelsTransaction,
  BrokerUserService
} from "@core/api";
import {forkJoin, map, Observable, of, switchMap, tap} from "rxjs";
import {BrokerImageStore} from "@shared/stores/broker-image.service";

// Export a type that extends BrokersBroker and adds an imageUrl property
export type BrokerWithImage = ModelsBroker & { imageUrl?: string };
export type UserBrokerWithImage = Omit<ModelsBrokerUser, 'broker'> & { broker: BrokerWithImage };
export type TransactionWithImage = Omit<ModelsTransaction, 'broker'> & { broker: BrokerWithImage };

@Injectable({
  providedIn: 'root'
})
export class BrokerImageService {

  constructor(
    private brokerImageStore: BrokerImageStore,
    private brokersService: BrokersService,
    private brokerImagesService: BrokerImagesService,
    private brokerUserService: BrokerUserService,
    private transactionService: TransactionsService
  ) {}

  getBrokersWithImages(enabledOnly?: boolean): Observable<BrokerWithImage[]> {
    // Fetch brokers from the service
    return this.brokersService.listBrokers(enabledOnly ? 'true' : 'false').pipe(
      switchMap((brokers: ModelsBroker[]) => {
        // For each broker, fetch the corresponding image
        const brokerImageRequests = brokers.map(broker => {
          // If the broker does not have an image, return the broker as is
          if (!broker.image_id) {
            return of(broker);
          }

          // Check if the broker image is already cached
          const cachedImage = this.brokerImageStore.brokerImages.get(broker.image_id);
          if (cachedImage) {
            return of({
              ...broker,
              imageUrl: cachedImage
            });
          }

          // Fetch the broker image and map it to the broker
          return this.brokerImagesService.getBrokerImage(broker.id!, broker.image_id).pipe(
            map(image => {
              const imageUrl = URL.createObjectURL(image);
              // Cache the image for future use
              this.brokerImageStore.brokerImages?.set(broker.image_id!, imageUrl);
              return {
                ...broker,
                imageUrl
              };
            })
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
    return this.brokerUserService.listUserBrokers().pipe(

      switchMap((userBrokers: ModelsBrokerUser[]) => {
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

          // Check if the broker image is already cached
          const cachedImage = this.brokerImageStore.brokerImages.get(userBroker.broker.image_id);
          if (cachedImage) {
            return of({
              ...userBroker,
              broker: {
                ...userBroker.broker,
                imageUrl: cachedImage
              }
            } as UserBrokerWithImage);
          }

          // Fetch the broker image and map it to the broker
          return this.brokerImagesService.getBrokerImage(userBroker.broker.id!, userBroker.broker.image_id).pipe(
            map(image => {
              const imageUrl = URL.createObjectURL(image);
              if (userBroker.broker?.image_id) {
                // Cache the image for future use
                this.brokerImageStore.brokerImages?.set(userBroker.broker.image_id!, imageUrl);
              }
              return {
                ...userBroker,
                broker: {
                  ...userBroker.broker,
                  imageUrl
                }
              } as UserBrokerWithImage;
            })
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

  cacheImagesAndGetTransactionsWithImages(): Observable<TransactionWithImage[]> {

    // Note : Didn't find a way to run all observables in parallel to check for cached images and update the cache.
    // Please cache the user brokers images before calling this function since it will be faster.
    // It might have 10K+ transactions with the same broker image === 10K+ requests to the same image.

    return this.brokerImageStore.brokerImages.size === 0
      ? this.getUsersBrokersWithImages().pipe(switchMap(() => this.getTransactionsWithImages()))
      : this.getTransactionsWithImages();
  }

  private getTransactionsWithImages(): Observable<TransactionWithImage[]> {

    // Fetch transactions from the service
    return this.transactionService.getTransactions().pipe(
      switchMap((transactions: ModelsTransaction[]) => {

        // For each transaction, fetch the corresponding image
        const transactionImageRequests = transactions.map(transaction =>
          this.mapTransactionWithImage(transaction)
        );

        // Combine all image requests into a single observable
        return forkJoin(transactionImageRequests).pipe(
          // Cache the transactions with images and return them
          tap({
            next: transactionsWithImages => transactionsWithImages
          })
        );
      })
    );
  }

  getTransactionWithImage(transactionId: string): Observable<TransactionWithImage> {
    return this.transactionService.getTransaction(transactionId).pipe(
      switchMap(transaction => this.mapTransactionWithImage(transaction))
    );
  }

  private mapTransactionWithImage(transaction: ModelsTransaction): Observable<TransactionWithImage> {
    // If the broker does not have an image, return the broker as is
    if (!transaction.broker?.image_id) {
      return of({
        ...transaction,
        broker: {
          ...transaction.broker,
          imageUrl: undefined
        }
      } as TransactionWithImage);
    }

    // Check if the broker image is already cached
    const cachedImage = this.brokerImageStore.brokerImages.get(transaction.broker!.image_id!);
    if (cachedImage) {
      return of({
        ...transaction,
        broker: {
          ...transaction.broker,
          imageUrl: cachedImage
        }
      } as TransactionWithImage);
    }

    // Fetch the broker image and map it to the broker
    return this.brokerImagesService.getBrokerImage(transaction.broker.id!, transaction.broker.image_id).pipe(
      map(image => {
        const imageUrl = URL.createObjectURL(image);
        if (transaction.broker?.image_id) {
          // Cache the image for future use
          this.brokerImageStore.brokerImages?.set(transaction.broker.image_id, imageUrl);
        }
        return {
          ...transaction,
          broker: {
            ...transaction.broker,
            imageUrl
          }
        } as TransactionWithImage;
      })
    );
  }
}
