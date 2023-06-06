import { IFieldRepository } from "src/types/interfaces/repositories/IFieldRepository";

export const SessionServiceMock = () => ({
  addField: jest.fn(),
  addShip: jest.fn(),
  removeField: jest.fn(),
  updateField: jest.fn(),
  getField: jest.fn(),
}) as IFieldRepository;
