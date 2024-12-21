import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { ImageEntity } from './image.entity';

describe('Image - Entity', () => {
  it('should be able to create a image as an entity', () => {
    const output = ImageEntity.create({
      url: 'url-test',
      advertisementImageId: new UniqueEntityId(),
      advertisementThumbnailId: new UniqueEntityId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.url).toBe('url-test');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
    expect(output.advertisementImageId).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementThumbnailId).toBeInstanceOf(UniqueEntityId);
  });
});
