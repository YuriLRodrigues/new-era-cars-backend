import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateLikeFeedbackUseCase } from './create-like-feedback.use-case';

describe('Create Like Feedback - Use Case', () => {
  let sut: CreateLikeFeedbackUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new CreateLikeFeedbackUseCase(inMemoryLikeFeedbackRepository, inMemoryFeedbackRepository);
  });

  it('should be able create a new like to a advertisement if already exists', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({
      userId: user.id,
      comment: 'Test Comment',
      stars: 1,
      advertisementId: advertisement.id,
    });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(LikeEntity);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(1);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes[0]).toEqual(
      expect.objectContaining({
        feedbackId: feedback.id,
        userId: user.id,
      }),
    );
  });

  it('should not be able create a new like to a advertisement if feedbackId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      feedbackId: new UniqueEntityId(),
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Feedback not found'));
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(0);
  });

  it('should be able to remove the like if user already liked feedback', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    const like = makeFakeLike({ advertisementId: advertisement.id, userId: user.id, feedbackId: feedback.id });
    inMemoryLikeFeedbackRepository.create({ like });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(null);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(0);
  });
});
