import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateFeedbackUseCase } from './create-feedback.use-case';

describe('Create Feedback - Use Case', () => {
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let sut: CreateFeedbackUseCase;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    sut = new CreateFeedbackUseCase(inMemoryFeedbackRepository, inMemoryAdvertisementRepository); // kalil qnt de in memory dependente
  });

  it('should be able top create a new feedback in any ', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      comment: 'New Comment',
      stars: 5,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(1);
    expect(output.value).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        comment: 'New Comment',
        stars: 5,
        userId: user.id,
      }),
    );
  });

  it('should not be able possible to create new feedback if an ad does not exist', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
      comment: 'New Comment',
      stars: 5,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Advertisement not found'));
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(0);
  });
});
