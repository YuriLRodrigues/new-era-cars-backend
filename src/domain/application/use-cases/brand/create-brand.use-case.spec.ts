import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';

import { CreateBrandUseCase } from './create-brand.use-case';

describe('Create Brand - Use Case', () => {
  let sut: CreateBrandUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    sut = new CreateBrandUseCase(inMemoryBrandRepository);
  });

  it('should be able to create an new brand', async () => {
    const output = await sut.execute({
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if name already exists', async () => {
    await sut.execute({
      logoUrl: 'url-test',
      name: 'Test',
    });

    const output = await sut.execute({
      logoUrl: 'url-test',
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new Error('Brand already exists'));
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });
});
