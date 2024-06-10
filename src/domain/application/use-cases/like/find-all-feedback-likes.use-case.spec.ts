import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllFeedbackLikesUseCase } from './find-all-feedback-likes.use-case';

describe('Find All Feedback Likes - Use Case', () => {
  let sut: FindAllFeedbackLikesUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new FindAllFeedbackLikesUseCase(inMemoryLikeFeedbackRepository, inMemoryFeedbackRepository);
  });

  it('should be able to find all likes of a feedback by your id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike({ feedbackId: feedback.id, userId: user.id });
      inMemoryLikeFeedbackRepository.create({ like });
    });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike();
      inMemoryLikeFeedbackRepository.create({ like });
    });

    const output = await sut.execute({
      feedbackId: feedback.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(5);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(10);
  });

  it('should not be able to find all likes of a feedback if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      feedbackId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Feedback not found'));
  });
});
