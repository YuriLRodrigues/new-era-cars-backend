import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteFeedbackUseCase } from './delete-feedback.use-case';

describe('Create Feedback - Use Case', () => {
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let sut: DeleteFeedbackUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(inMemoryBrandRepository);
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new DeleteFeedbackUseCase(inMemoryFeedbackRepository, inMemoryUserRepository);
  });

  it('should be able to delete an feedback if an advertisement exists and your are the owner or manager', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ userId: user.id, advertisementId: advertisement.id });
    inMemoryFeedbackRepository.create({ feedback });

    Array.from({ length: 5 }).map(() => {
      const feedback = makeFakeFeedback({ advertisementId: advertisement.id });
      inMemoryFeedbackRepository.create({ feedback });
    });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(5);
  });

  it('should not be able to delete an feedback if an advertisement exists and your are not the owner or manager', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('You do not have permission to delete this feedback'));
  });

  it('should not be able to delete an feedback if an advertisement exists but userId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('User not found'));
  });

  it('should not be able to delete an feedback if an advertisementId is invalid (non-existent)', async () => {
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
  });
});
