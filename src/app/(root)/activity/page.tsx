import Image from 'next/image';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { GET_USER, GET_USER_ACTIVITY } from '@/lib/actions/user.actions';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await GET_USER(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const activity = await GET_USER_ACTIVITY(userInfo._id);

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="user_logo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{' '}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3 no-result">
            No activity yet!
          </p>
        )}
      </section>
    </>
  );
}
