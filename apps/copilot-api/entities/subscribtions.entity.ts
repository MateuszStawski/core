import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SubscribersEntity } from './subscribers.entity';
import { AddressesEntity } from './addreesses.entity';

@Entity('subscriptions')
export class SubscriptionsEntity {
  @PrimaryColumn({ type: 'text', name: 'subscriber_id' })
  readonly subscriber_id!: string;

  @PrimaryColumn({ type: 'text', name: 'address' })
  readonly address!: string;

  @Column({ type: 'integer', name: 'fid', nullable: true })
  readonly fid!: number;

  @ManyToOne(() => SubscribersEntity)
  @JoinColumn({ name: 'subscriber_id' })
  readonly subscriber!: SubscribersEntity;

  @ManyToOne(() => AddressesEntity)
  @JoinColumn({ name: 'address' })
  readonly addressEntity!: AddressesEntity;
}
