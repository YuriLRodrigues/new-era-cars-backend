import { HashGenerator } from '@root/domain/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return plain === hashed;
  }
}
