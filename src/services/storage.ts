import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRepository } from './repository';
export const repository = createRepository(AsyncStorage);
