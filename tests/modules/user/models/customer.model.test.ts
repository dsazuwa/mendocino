import { Customer, CustomerStatusType } from 'modules/user/models';

import '../../../db-setup';

const raw = true;

describe('Customer Model', () => {
  it('should create customer', async () => {
    const data = {
      firstName: 'Jolene',
      lastName: 'Doe',
      status: 'active' as CustomerStatusType,
    };
    const customer = await Customer.create(data);

    expect(customer).toMatchObject(data);
  });

  it('should retrieve customer', async () => {
    const data = {
      firstName: 'Janice',
      lastName: 'Doe',
      status: 'active' as CustomerStatusType,
    };

    const { customerId } = await Customer.create(data);

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).toMatchObject(data);
  });

  it('should update customer', async () => {
    const customer = await Customer.create({
      firstName: 'Joy',
      lastName: 'Doe',
      status: 'active',
    });
    const firstName = 'Joyous';

    await customer.update({ firstName });

    const updatedCustomer = await Customer.findByPk(customer.customerId, {
      raw,
    });
    expect(updatedCustomer?.firstName).toEqual(firstName);
  });

  it('should delete customer', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joel',
      lastName: 'Doe',
      status: 'active',
    });

    await Customer.destroy({ where: { customerId } });

    const deletedCustomer = await Customer.findByPk(customerId, { raw });
    expect(deletedCustomer).toBeNull();
  });
});
