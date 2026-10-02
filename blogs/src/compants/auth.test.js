import { isAdminUsername } from './auth';

test('only the admin username is recognized as admin', () => {
    expect(isAdminUsername('admin')).toBe(true);
    expect(isAdminUsername(' Admin ')).toBe(true);
    expect(isAdminUsername('admin1234@gmail')).toBe(true);
    expect(isAdminUsername('notadmin')).toBe(false);
    expect(isAdminUsername('admin-user')).toBe(true);
    expect(isAdminUsername('')).toBe(false);
});