import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllByAdvertisementIdUseCase } from './find-all-by-advertisement-id.use-case';

describe('Find All By Advertisement Id - Use Case', () => {
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let sut: FindAllByAdvertisementIdUseCase;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new FindAllByAdvertisementIdUseCase(inMemoryFeedbackRepository);
  });

  it('should be able to find all feedbacks by advertisement id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    Array.from({ length: 5 }).map(() => {
      const user = makeFakeUser();
      inMemoryUserRepository.register({ user });

      const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
      inMemoryFeedbackRepository.create({ feedback });
    });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(5);
    expect(output.value).toHaveLength(5);
  });
});
